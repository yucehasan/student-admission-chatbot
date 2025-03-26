terraform {
  required_version = "1.10.4"
  required_providers {
    aws = {
        version = ">= 2.7.0"
        source = "hashicorp/aws"
    }
  }
}