import { z } from "zod";

const passwordValidation = new RegExp(
    /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/
)

export const registerSchema = z.object({
    email: z.email(),
    password: z.string().regex(passwordValidation, {
        message: "Password must:\n- Contain 1 lowercase character\n- Contain 1 uppercase character\n- Contain 1 number\n- Contain 1 special character\n- Be 6-10 characters long"
    })
});

export type RegisterSchema = z.infer<typeof registerSchema>;