import { Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react"
import Review from "./Review";
import { useFetchAddressQuery, useUpdateUserAddressMutation } from "../account/accountApi";
import { ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { useBasket } from "../../lib/hooks/useBasket";
import { currencyFormat } from "../../lib/util";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../orders/orderApi";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const [createOrder] = useCreateOrderMutation();
    const {basket} = useBasket();
    const {data, isLoading} = useFetchAddressQuery();
    const [updateAddress] = useUpdateUserAddressMutation();
    const [saveAddressChecked, setSaveAddressChecked] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const [addressComplete, setAddressComplete] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const {total, clearBasket} = useBasket();
    const navigate = useNavigate();
    const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);

    let name, restAddress;
    if (data) {
        ({name, ...restAddress} = data);
    }

    const handleNext = async () => {
        if (activeStep === 0 && saveAddressChecked && elements) {
            const address = await getStripeAddress();
            if (address) await updateAddress(address);
        }
        if (activeStep === 1) {
            if (!elements || !stripe) return;
            const result = await elements.submit();
            if (result.error) return toast.error(result.error.message);

            const stripeResult = await stripe.createConfirmationToken({elements}); // confirmation token coming from stripe
            if (stripeResult.error) return toast.error(stripeResult.error.message);
            setConfirmationToken(stripeResult.confirmationToken);
        }
        if (activeStep === 2) {
            await confirmPayment();
        }
        if (activeStep < 2) setActiveStep(step => step + 1);
    }

    const confirmPayment = async () => {
        setSubmitting(true);
        try {
            if (!confirmationToken || !basket?.clientSecret) 
                throw new Error('Unable to process payment');

            const orderModel = await createOrderModel();
            const orderResult = await createOrder(orderModel);

            const paymentResult = await stripe?.confirmPayment({
                clientSecret: basket.clientSecret,
                redirect: 'if_required',
                confirmParams: {
                    confirmation_token: confirmationToken.id
                }
            });

            if (paymentResult?.paymentIntent?.status === 'succeeded') {
                navigate('/checkout/success', {state: orderResult});
                clearBasket();
            } else if (paymentResult?.error) {
                throw new Error(paymentResult.error.message);
            } else {
                throw new Error('Something went wrong');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            }
            setActiveStep(step => step - 1);
        } finally {
            setSubmitting(false)
        }
    }

    const createOrderModel = async () => {
        const shippingAddress = await getStripeAddress();
        const paymentSummary = confirmationToken?.payment_method_preview.card;

        if (!shippingAddress || !paymentSummary) throw new Error('Problem creating order');

        return {shippingAddress, paymentSummary}
    }

    const getStripeAddress = async () => {
        const addressElement = elements?.getElement('address');
        if (!addressElement) return null;
        const {value: {name, address}} = await addressElement.getValue();

        // separate name and address as per stripe address usage
        if (name && address) return {...address, name}

        return null;
    }    

    const handleBack = () => {
        if (activeStep === 0) {
            navigate("/basket");
        }
        else {
            setActiveStep(step => step - 1);
        }
    }

    const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
        setAddressComplete(event.complete)
    }

    const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
        setPaymentComplete(event.complete)
    }

    if (isLoading) return <Typography variant="h6">Loading checkout...</Typography>

    return (
        // Paper is a Material UI component used to give a card-like appearance.
        // sx={{p: 3, borderRadius: 3}} adds padding and rounded corners.
        <Paper sx={{p: 3, borderRadius: 3}}>

            {/* Stepper UI to show progress across multiple steps (e.g. Address -> Payment -> Review) */}
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel> {/* Label for each step */}
                        </Step>
                    )
                })}
            </Stepper>

            <Box sx={{mt: 2}}>
                {/* Step 0: Address form using Stripe's AddressElement */}
                <Box sx={{display: activeStep === 0 ? 'block' : 'none'}}>
                    <AddressElement 
                        options={{
                            mode: 'shipping', // Mode set to 'shipping' for shipping address
                            defaultValues: {
                                name: name, // Prefill name if available
                                address: restAddress // Prefill address fields
                            }
                        }}
                        onChange={handleAddressChange} // Triggered when address fields change
                    />

                    {/* Checkbox to allow users to save the address as their default */}
                    <FormControlLabel 
                        sx={{display: 'flex', justifyContent: 'end'}}
                        control={
                            <Checkbox 
                                checked={saveAddressChecked}
                                onChange={e => setSaveAddressChecked(e.target.checked)} // Toggle checkbox state
                            />
                        }
                        label='Save as default address'
                    />
                </Box>

                {/* Step 1: Payment form using Stripe's PaymentElement */}
                <Box sx={{display: activeStep === 1 ? 'block' : 'none'}}>
                    <PaymentElement 
                        onChange={handlePaymentChange} 
                        options={{
                            wallets: {
                                applePay: "never",
                                googlePay: "never"
                            }
                        }}
                    />
                </Box>

                {/* Step 2: Final step - Show order review (e.g. items, total, address) */}
                <Box sx={{display: activeStep === 2 ? 'block' : 'none'}}>
                    <Review confirmationToken={confirmationToken} />
                </Box>
            </Box>

            {/* Navigation buttons: Back and Next/Pay */}
            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack}>Back</Button>

                {/* Next button (or Pay on last step). It shows loading state when submitting */}
                <Button 
                    onClick={handleNext}
                    disabled={
                        // Disable if address is incomplete on step 0,
                        // or payment is incomplete on step 1, or if already submitting
                        (activeStep === 0 && !addressComplete) ||
                        (activeStep === 1 && !paymentComplete) ||
                        submitting
                    }
                    loading={submitting}
                >
                    {/* Label: "Pay" + total amount on final step, otherwise just "Next" */}
                    {activeStep === steps.length - 1 ? `Pay ${currencyFormat(total)}` : 'Next'}
                </Button>
            </Box>

        </Paper>

    )
}