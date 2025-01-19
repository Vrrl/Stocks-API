variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "sns_matching_engine_topic_arn" {
  description = "SNS Matching Engine Topic ARN"
  type        = string
}

variable "dynamo_orders_table_name" {
  description = "DynamoDB Orders Table"
  type        = string
  default     = "Orders"
}

variable "sns_order_process_topic_name" {
  description = "SNS Order Process Topic Name"
  type        = string
  default     = "OrderProcessTopic"
}

variable "sns_order_post_process_topic_name" {
  description = "SNS Order Post Process Topic Name"
  type        = string
  default     = "OrderPostProcessTopic"
}

variable "post_processing_order_cancelation_queue_name" {
  description = "SQS Post Processing Order Cancelation Queue Name"
  type        = string
  default     = "PostProcessingOrderCancelationQueue"
}

variable "post_processing_order_edition_queue_name" {
  description = "SQS Post Processing Order Edition Queue Name"
  type        = string
  default     = "PostProcessingOrderEditionQueue"
}
