import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  recipient: MongooseSchema.Types.ObjectId;

  @Prop()
  message: string;

  @Prop()
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
