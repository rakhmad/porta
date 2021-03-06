# frozen_string_literal: true

class ContractDecorator < ApplicationDecorator
  delegate :admin_user_display_name, to: :account, prefix: :account

  private

  def account
    @account ||= super.decorate
  end
end
