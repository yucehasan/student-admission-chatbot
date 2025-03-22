resource "aws_ecs_cluster" "ecs_cluster" {
  name = "my-ecs-cluster"
}

resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
  name = "test1"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

    managed_scaling {
      maximum_scaling_step_size = 1
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 1
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.ecs_cluster.name

  capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
  }
}

resource "aws_ecs_task_definition" "ecs_fe_task_definition" {
  family             = "my-ecs-task-frontend"
  network_mode       = "awsvpc"
  execution_role_arn = "arn:aws:iam::961889141255:role/ecsTaskExecutionRole"
  cpu                = 384
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
  container_definitions = jsonencode([
    {
      name      = "dockergs"
      image     = "961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/frontend:latest"
      cpu       = 384
      memory    = 400
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "ecs_service_fe" {
  name            = "my-ecs-service_fe"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_fe_task_definition.arn
  desired_count   = 1

  network_configuration {
    subnets         = [aws_subnet.subnet.id, aws_subnet.subnet2.id]
    security_groups = [aws_security_group.security_group.id]
  }

  force_new_deployment = true
  placement_constraints {
    type = "distinctInstance"
  }

  triggers = {
    redeployment = timestamp()
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
    weight            = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg_fe.arn
    container_name   = "dockergs"
    container_port   = 3000
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}


resource "aws_ecs_task_definition" "ecs_be_task_definition" {
  family             = "my-ecs-task-backend"
  network_mode       = "awsvpc"
  execution_role_arn = "arn:aws:iam::961889141255:role/ecsTaskExecutionRole"
  cpu                = 384
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
  container_definitions = jsonencode([
    {
      name      = "backend-container"
      image     = "961889141255.dkr.ecr.us-east-1.amazonaws.com/student-chatbot/backend:latest"
      cpu       = 384
      memory    = 400
      essential = true
      portMappings = [
        {
          containerPort = 3004
          hostPort      = 3004
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "ecs_service_be" {
  name            = "my-ecs-service-be"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_be_task_definition.arn
  desired_count   = 1

  network_configuration {
    subnets         = [aws_subnet.subnet.id, aws_subnet.subnet2.id]
    security_groups = [aws_security_group.security_group.id]
  }

  force_new_deployment = true
  placement_constraints {
    type = "distinctInstance"
  }

  triggers = {
    redeployment = timestamp()
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
    weight            = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg_be.arn
    container_name   = "backend-container"
    container_port   = 3004
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}
