import z from "zod";

const RequestCreatePushTokenSchema = z.object({
    pushToken: z.string(),
    platform: z.literal(["firebase", "expo"]),
    userId: z.coerce.number()
});

export { RequestCreatePushTokenSchema };