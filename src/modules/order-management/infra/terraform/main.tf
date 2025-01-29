resource "aws_dynamodb_table" "orders_table" {
  name         = var.dynamo_orders_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "shareholderId"
  range_key    = "id"

  attribute {
    name = "shareholderId"
    type = "S"
  }

  attribute {
    name = "id"
    type = "S"
  }

  global_secondary_index {
    name            = "id-index"
    hash_key        = "id"
    projection_type = "ALL"
  }

  # lifecycle {
  #   prevent_destroy = true
  # }
}

resource "aws_sns_topic" "sns_order_process_topic" {
  name = var.sns_order_process_topic_name
}

resource "aws_sns_topic" "sns_order_post_process_topic" {
  name = var.sns_order_post_process_topic_name
}

resource "aws_sqs_queue" "post_processing_order_cancelation_queue" {
  name                       = var.post_processing_order_cancelation_queue_name
  visibility_timeout_seconds = 900
}

resource "aws_sns_topic_subscription" "post_processing_order_cancelation_subscription" {
  topic_arn = var.sns_matching_engine_topic_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.post_processing_order_cancelation_queue.arn

  raw_message_delivery = true

  filter_policy = jsonencode({
    eventType = ["ORDER_CANCELED"]
  })
}

resource "aws_sqs_queue_policy" "post_processing_order_cancelation_queue_policy" {
  queue_url = aws_sqs_queue.post_processing_order_cancelation_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "sns.amazonaws.com" },
        Action    = "SQS:SendMessage",
        Resource  = aws_sqs_queue.post_processing_order_cancelation_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_matching_engine_topic_arn
          }
        }
      }
    ]
  })
}

resource "aws_sqs_queue" "post_processing_order_edition_queue" {
  name                       = var.post_processing_order_edition_queue_name
  visibility_timeout_seconds = 900
}

resource "aws_sns_topic_subscription" "post_processing_order_edition_subscription" {
  topic_arn = var.sns_matching_engine_topic_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.post_processing_order_edition_queue.arn

  raw_message_delivery = true

  filter_policy = jsonencode({
    eventType = ["ORDER_EDITED"]
  })
}

resource "aws_sqs_queue_policy" "post_processing_order_edition_policy" {
  queue_url = aws_sqs_queue.post_processing_order_edition_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "sns.amazonaws.com" },
        Action    = "SQS:SendMessage",
        Resource  = aws_sqs_queue.post_processing_order_edition_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_matching_engine_topic_arn
          }
        }
      }
    ]
  })
}

resource "aws_sqs_queue" "post_processing_order_executed_queue" {
  name                       = var.post_processing_order_executed_queue_name
  visibility_timeout_seconds = 900
}

resource "aws_sns_topic_subscription" "post_processing_order_executed_subscription" {
  topic_arn = var.sns_matching_engine_topic_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.post_processing_order_executed_queue.arn

  raw_message_delivery = true

  filter_policy = jsonencode({
    eventType = ["ORDER_MATCH"]
  })
}

resource "aws_sqs_queue_policy" "post_processing_order_executed_policy" {
  queue_url = aws_sqs_queue.post_processing_order_executed_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "sns.amazonaws.com" },
        Action    = "SQS:SendMessage",
        Resource  = aws_sqs_queue.post_processing_order_executed_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_matching_engine_topic_arn
          }
        }
      }
    ]
  })
}

resource "aws_sqs_queue" "post_processing_order_expired_queue" {
  name                       = var.post_processing_order_expired_queue_name
  visibility_timeout_seconds = 900
}

resource "aws_sns_topic_subscription" "post_processing_order_expired_subscription" {
  topic_arn = var.sns_matching_engine_topic_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.post_processing_order_expired_queue.arn

  raw_message_delivery = true

  filter_policy = jsonencode({
    eventType = ["ORDER_EXPIRED"]
  })
}

resource "aws_sqs_queue_policy" "post_processing_order_expired_policy" {
  queue_url = aws_sqs_queue.post_processing_order_expired_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "sns.amazonaws.com" },
        Action    = "SQS:SendMessage",
        Resource  = aws_sqs_queue.post_processing_order_expired_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_matching_engine_topic_arn
          }
        }
      }
    ]
  })
}