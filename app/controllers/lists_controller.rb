class ListsController < ApplicationController
	respond_to :json, :html

	def index
		respond_with List.find_each
	end

	def show
		respond_with find_task.as_json(include: :tasks)
	end

	def create
		
	end

	private

	def list_params
		params.require(:list).permit(:name)
	end

	def find_task
		List.find(params[:id])
	end
end