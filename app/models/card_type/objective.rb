class CardType::Objective < ApplicationRecord
  include CardType::Concern
  belongs_to :quest, class_name: 'CardType::Quest'
  belongs_to :location, class_name: 'CardType::Location', optional: true

  def self.permitted_attributes
    %i[completed quest_id location_id]
  end

  def self.description
    "A single part of a quest"
  end

  def self.icon
    "ra ra-key"
   end
end
