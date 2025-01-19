resource "aws_cognito_user_pool" "user_pool" {
  name                     = var.user_pool_name
  alias_attributes         = ["preferred_username", "email"]
  auto_verified_attributes = ["email"]

  schema {
    attribute_data_type = "String"
    name                = "email"
    required            = true
  }

  schema {
    name                = "nickname"
    attribute_data_type = "String"
    required            = true
  }

  schema {
    name                = "picture"
    attribute_data_type = "String"
    required            = false
  }

  schema {
    name                = "internalId"
    attribute_data_type = "String"
  }

  mfa_configuration = "OFF"

  lifecycle {
    ignore_changes = [schema]
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name                = var.user_pool_client_name
  user_pool_id        = aws_cognito_user_pool.user_pool.id
  generate_secret     = false
  explicit_auth_flows = ["USER_PASSWORD_AUTH"]
  # explicit_auth_flows = ["ADMIN_NO_SRP_AUTH"]
  allowed_oauth_flows          = ["implicit"]
  allowed_oauth_scopes         = ["openid", "email", "profile"]
  supported_identity_providers = ["COGNITO"]

  callback_urls = ["https://example.com/callback"]
  logout_urls   = ["https://example.com/logout"]

  read_attributes = [
    "email",
    "nickname",
    "picture",
    "email_verified",
    "custom:internalId"
  ]

  write_attributes = [
    "email",
    "nickname",
    "picture",
    "custom:internalId"
  ]

  depends_on = [aws_cognito_user_pool.user_pool]
}