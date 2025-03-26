# Create VPC
resource "aws_vpc" "model_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "ModelVpc"
  }
}

# Create Private Subnet
resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.model_vpc.id
  cidr_block        = vpc_cidr
  availability_zone = "us-east-1a"

  tags = {
    Name = "PrivateSubnet"
  }
}

# Create Security Group for Private Subnet (Allows traffic only from ECS)
resource "aws_security_group" "gpu_ec2_sg" {
  vpc_id = aws_vpc.my_vpc.id  # Uses the previously created VPC

  # Allow inbound traffic only from ECS task IP range
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ecs_cidr
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "GPU_EC2_SG"
  }
}

# Create Private Route Table
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.model_vpc.id

  tags = {
    Name = "PrivateRouteTable"
  }
}

# Associate Private Subnet with Private Route Table
resource "aws_route_table_association" "private_association" {
  subnet_id      = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.private_rt.id
}


# Data source to get latest Amazon Linux 2 AMI (Adjust for GPU-supported AMIs)
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Create EC2 instance with g4dn.xlarge (GPU instance)
resource "aws_instance" "gpu_instance" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "g4dn.xlarge"
  subnet_id              = aws_subnet.private_subnet.id  # Using the private subnet from our VPC
  vpc_security_group_ids = [aws_security_group.gpu_ec2_sg.id]  # Associate the security group

  # Optional: Attach IAM role for additional permissions
  iam_instance_profile = aws_iam_instance_profile.gpu_instance_profile.name

  root_block_device {
    volume_size = 100  
  }

  tags = {
    Name = "GPU-Instance"
  }
}

# IAM Role for EC2 (Optional: Modify permissions as needed)
resource "aws_iam_role" "gpu_instance_role" {
  name = "GPUInstanceRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

# Attach Policies to the IAM Role
resource "aws_iam_policy_attachment" "gpu_policy_attachment" {
  name       = "GPUInstancePolicyAttachment"
  roles      = [aws_iam_role.gpu_instance_role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess" # Example policy
}

# IAM Instance Profile
resource "aws_iam_instance_profile" "gpu_instance_profile" {
  name = "GPUInstanceProfile"
  role = aws_iam_role.gpu_instance_role.name
}


