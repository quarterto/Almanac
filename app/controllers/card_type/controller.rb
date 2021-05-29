class CardType::Controller < ApplicationController
   before_action :set_card, only: %i[show edit update destroy]
   before_action :set_campaign, only: %i[index new create show edit update destroy]

   def new
      @card = Card.new
      @card.actable = card_type.new
   end

   def show; end
   def edit; end

   def set_card
      @card = Card.find_by_slug(params[:id]).specific
   end

   def set_campaign
      @campaign = Campaign.find_by_slug(params[:campaign_id])
   end

   def card_type
      raise NotImplementedError
   end

   def self.controller_path
      super.gsub(/^card_type\//, '')
   end
end
