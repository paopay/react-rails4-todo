Rails.application.routes.draw do
  root 'home#index'

  resources :lists, only: [:index, :show, :update, :create, :destroy] do
    resources :tasks, only: [:update, :create, :destroy]
  end
end
