resource "aws_sns_topic" "sns_matching_engine_topic" {
  name = var.sns_matching_engine_topic_name
}

resource "aws_sqs_queue" "order_matching_queue" {
  name                       = var.order_matching_queue_name
  visibility_timeout_seconds = 900
}

resource "aws_sns_topic_subscription" "order_matching_queue_subscription" {
  topic_arn = var.sns_order_process_topic_arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.order_matching_queue.arn

  raw_message_delivery = true

  filter_policy = jsonencode({
    eventType = ["ORDER_CREATED", "ORDER_CANCELED", "ORDER_EDITED"]
  })
}

resource "aws_sqs_queue_policy" "order_matching_queue_policy" {
  queue_url = aws_sqs_queue.order_matching_queue.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Principal = { Service = "sns.amazonaws.com" },
        Action    = "SQS:SendMessage",
        Resource  = aws_sqs_queue.order_matching_queue.arn,
        Condition = {
          ArnEquals = {
            "aws:SourceArn" = var.sns_order_process_topic_arn
          }
        }
      }
    ]
  })
}