class ListsController < ApplicationController
	respond_to :json

	def index
		respond_with List.find_each
	end

	

	private

	def list_params
		params.require(:list).permit(:name)
	end
end