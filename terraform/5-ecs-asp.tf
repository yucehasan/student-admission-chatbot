resource "aws_appautoscaling_target" "ecs_frontend_service_target" {
  max_capacity       = 3 # Maximum number of tasks
  min_capacity       = 1 # Minimum number of tasks
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.ecs_service_frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "frontend_scale_out_policy" {
  name               = "frontend-scale-out-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.ecs_service_frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  target_tracking_scaling_policy_configuration {
    target_value = 50.0 # Target CPU utilization percentage
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_out_cooldown = 60
    scale_in_cooldown  = 60
  }
}

resource "aws_appautoscaling_target" "ecs_backend_service_target" {
  max_capacity       = 10 # Maximum number of tasks
  min_capacity       = 1  # Minimum number of tasks
  resource_id        = "service/${aws_ecs_cluster.ecs_cluster.name}/${aws_ecs_service.ecs_service_backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_scale_out_policy" {
  name               = "backend-scale-out-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_backend_service_target.resource_id
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  target_tracking_scaling_policy_configuration {
    target_value = 50.0 # Target CPU utilization percentage
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_out_cooldown = 60
    scale_in_cooldown  = 60
  }
}
