class TasksController < ApplicationController
	respond_to :json

	def index
		respond_with Task.find_each
	end
	

end