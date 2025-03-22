resource "aws_lb" "ecs_alb" {
  name               = "ecs-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.security_group.id]
  subnets            = [aws_subnet.subnet.id, aws_subnet.subnet2.id]

  tags = {
    Name = "ecs-alb"
  }
}
resource "aws_lb_listener" "ecs_alb_listener_fe" {
    load_balancer_arn = aws_lb.ecs_alb.arn
    port              = 80
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.ecs_tg_fe.arn
    }
}

resource "aws_lb_listener" "ecs_alb_listener_be" {
    load_balancer_arn = aws_lb.ecs_alb.arn
    port              = 3004
    protocol          = "HTTP"

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.ecs_tg_be.arn
    }
}

resource "aws_lb_target_group" "ecs_tg_fe" {
  name        = "ecs-target-group-fe"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    path = "/"
  }
}

resource "aws_lb_target_group" "ecs_tg_be" {
  name        = "ecs-target-group-be"
  port        = 3004
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    path = "/"
  }
}
