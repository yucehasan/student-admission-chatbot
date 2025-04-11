resource "aws_security_group" "ecs_sg_public" {
  name   = "ecs-sg-public"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg_public.id]
    description     = "Allow app traffic from Public ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-sg-public"
  }
}


resource "aws_launch_template" "ecs_lt_public" {
  name          = "ecs-template-public"
  image_id      = "ami-0d93cbafdab575cee"
  instance_type = "t2.small"

  key_name               = "ec2ecsglog"
  vpc_security_group_ids = [aws_security_group.ecs_sg_public.id]

  iam_instance_profile {
    name = "ecsInstanceRole"
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30
      volume_type = "gp2"
    }
  }

  user_data = filebase64("${path.module}/ecs.sh")

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-instance-public"
    }
  }
}

resource "aws_security_group" "ecs_sg_private" {
  name   = "ecs-private-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 3004
    to_port         = 3004
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg_private.id]
    description     = "Allow traffic from Private ALB"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-sg-private"
  }
}

resource "aws_launch_template" "ecs_lt_private" {
  name          = "ecs-template-private"
  image_id      = "ami-0d93cbafdab575cee"
  instance_type = "t2.small"

  key_name               = "ec2ecsglog"
  vpc_security_group_ids = [aws_security_group.ecs_sg_private.id]

  iam_instance_profile {
    name = "ecsInstanceRole"
  }

  block_device_mappings {
    device_name = "/dev/xvda"
    ebs {
      volume_size = 30
      volume_type = "gp2"
    }
  }

  user_data = filebase64("${path.module}/ecs.sh")

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "ecs-instance-private"
    }
  }
}
