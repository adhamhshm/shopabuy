using API.Entities;
using Stripe;

namespace API.Services;

public class PaymentsService()
{
    public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
    {

        // with (IConfiguration config) 
        // StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];
        // var service = new PaymentIntentService();

        StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");
        var service = new PaymentIntentService();

        var intent = new PaymentIntent();
        var subtotal = basket.Items.Sum(x => x.Quantity * x.Product.Price);
        var deliveryFee = subtotal > 10000 ? 0 : 500;

        if (string.IsNullOrEmpty(basket.PaymentIntentId))
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = subtotal + deliveryFee,
                Currency = "myr",
                PaymentMethodTypes = ["card"]
            };
            intent = await service.CreateAsync(options);
        }
        else
        {
            var options = new PaymentIntentUpdateOptions
            {
                Amount = subtotal + deliveryFee
            };
            await service.UpdateAsync(basket.PaymentIntentId, options);
        }

        return intent;
    }
}
