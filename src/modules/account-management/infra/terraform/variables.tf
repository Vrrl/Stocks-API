variable "region" {
  type = string
}

variable "stage" {
  type = string
}

variable "user_pool_name" {
  description = "Cognito User Pool Name"
  type        = string
  default     = "user_pool"
}

variable "user_pool_client_name" {
  description = "Cognito User Pool Client Name"
  type        = string
  default     = "user-pool-client"
}
