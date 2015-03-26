class ListsController < ApplicationController
	before_filter :find_list

	

	private
	
	def find_list
		@model = List.find(params[:id]) if params[:id]
	end
end