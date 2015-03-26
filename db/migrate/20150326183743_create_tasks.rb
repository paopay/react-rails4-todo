class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
    	t.string :description, null: false
    	t.date :due_date
    	t.boolean :complete, default: false
    	t.belongs_to :list
      t.timestamps null: false
    end
  end
end
