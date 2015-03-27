class ListsController < ApplicationController
	respond_to :json, :html

	def index
		respond_with List.find_each
	end

	def show
		# include tasks in the json object
		respond_with find_task.as_json(include: :tasks)
	end

	def create
		respond_with List.create(list_params)
	end

	def destroy
		respond_with find_task.destroy
	end

	private

	def list_params
		params.require(:list).permit(:name)
	end

	def find_task
		List.find(params[:id])
	end
end