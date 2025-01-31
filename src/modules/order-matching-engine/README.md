# Notes:

Because of project limitations, the reliability of the matching engine is achieved by 3 key points:
- saving snapshots of the order book from time to time and loading them at start
- assuming that sometimes the snapshot is not perfect and some events have already been processed, so it will process them again, but since each execution process has a unique id, the repeated processed events already sent must be ignored by other consumers
- visibility timeout for SQS queue is set to 0 to prevent ignoring the most recent processed message

The correct way to solve this regardless of the limitations should be using an immutable stream to replace SQS, such as Kafka or Kinesis, and from the snapshot, start reading the last item in the stream.