resource "aws_security_group" "alb_sg_public" {
  name   = "alb-sg-public"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    self        = "false"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP traffic from the internet"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb-sg-public"
  }
}

resource "aws_lb" "ecs_public_alb" {
  name               = "ecs-public-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg_public.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]

  tags = {
    Name = "ecs-public-alb"
  }
}

resource "aws_security_group" "alb_sg_private" {
  name   = "alb_sg_private"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_sg_public.id, aws_security_group.alb_sg_public.id]
    description     = "Allow traffic from public ECS instances"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb_sg_private"
  }
}

resource "aws_lb" "ecs_private_alb" {
  name               = "ecs-private-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg_private.id]
  subnets            = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]

  tags = {
    Name = "ecs-private-alb"
  }
}

resource "aws_lb_listener" "ecs_public_alb_listener" {
  load_balancer_arn = aws_lb.ecs_public_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg_public.arn
  }
}

resource "aws_lb_listener" "ecs_private_alb_listener" {
  load_balancer_arn = aws_lb.ecs_private_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg_private.arn
  }
}

resource "aws_lb_target_group" "ecs_tg_public" {
  name        = "ecs-target-group-public"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    path = "/"
  }
}

resource "aws_lb_target_group" "ecs_tg_private" {
  name        = "ecs-target-group-private"
  port        = 3004
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    path = "/"
  }
}
