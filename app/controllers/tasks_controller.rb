class TasksController < ApplicationController
	before_filter :find_task

	

	private

	def find_task
		@model = Task.find(params[:id]) if params[:id]
	end
	
end