variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "stage" {
  description = "Environment stage (e.g., dev, stage, prod)"
  type        = string
  default     = "prod"
}
