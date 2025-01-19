terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.83.1"
    }
  }
}

provider "aws" {
  shared_config_files      = ["C:/Users/nykog/.aws/config"]
  shared_credentials_files = ["C:/Users/nykog/.aws/credentials"]
  region                   = var.region
}

module "order_manager" {
  source = "../src/modules/order-management/infra/terraform"

  region = var.region
  stage  = var.stage

  sns_matching_engine_topic_arn = module.matching_engine.sns_matching_engine_topic_arn
}

module "account_manager" {
  source = "../src/modules/account-management/infra/terraform"

  region = var.region
  stage  = var.stage
}

module "matching_engine" {
  source = "../src/modules/order-matching-engine/infra/terraform"

  region = var.region
  stage  = var.stage

  sns_order_process_topic_arn = module.order_manager.sns_order_process_topic_arn
}
