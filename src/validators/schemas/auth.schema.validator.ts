import z from "zod";

const RequestAuthSchema = z.object({
    code: z.string(),
    deviceInfo: z.string()
});

export { RequestAuthSchema };