import z from "zod";

const RequestInsertReceptorSchema = z.object({
    userId: z.coerce.number().optional(),
    notificationId: z.coerce.number()
});

const RequestReceptorSchema = RequestInsertReceptorSchema.pick({
    userId: true
}).extend({
    lastNotificationDate: z.string().optional()
});

const RequestDeleteReceptorSchema = RequestInsertReceptorSchema.pick({
    userId: true
}).extend({
    receptorId: z.coerce.number()
});

const RequestUpdateLeidoSchema = RequestDeleteReceptorSchema;

export { 
    RequestInsertReceptorSchema, 
    RequestDeleteReceptorSchema, 
    RequestReceptorSchema, 
    RequestUpdateLeidoSchema 
};