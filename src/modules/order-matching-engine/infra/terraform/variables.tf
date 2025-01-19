variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "sns_order_process_topic_arn" {
  description = "SNS Order Process Topic ARN"
  type        = string
}

variable "sns_matching_engine_topic_name" {
  description = "SNS Matching Engine Topic Name"
  type        = string
  default     = "MatchingEngineTopic"
}

variable "order_matching_queue_name" {
  description = "SNS Matching Engine Topic Name"
  type        = string
  default     = "OrderMatchingEngineQueue"
}
