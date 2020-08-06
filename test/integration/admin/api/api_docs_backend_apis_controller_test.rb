# frozen_string_literal: true

require 'test_helper'

class Admin::Api::ApiDocsBackendApisControllerTest < ActionDispatch::IntegrationTest

  class MasterAccountTest < Admin::Api::ApiDocsBackendApisControllerTest

    def setup
      login! master_account
    end

    def test_index_json_saas
      get admin_api_backend_api_active_docs_path
      assert_response :success
    end

    def test_index_json_on_premises
      ThreeScale.stubs(master_on_premises?: true)
      get admin_api_backend_api_active_docs_path
      assert_response :forbidden
    end
  end

  class ProviderAccountTest < Admin::Api::ApiDocsBackendApisControllerTest

    attr_reader :provider, :backend_api, :api_docs_backend_api

    def setup
      @provider = FactoryBot.create(:provider_account)
      @backend_api = FactoryBot.create(:backend_api, account: @provider)
      @api_docs_backend_api = FactoryBot.create(:api_docs_service, account: @provider, owner: @backend_api)

      login! @provider
      host! @provider.admin_domain
    end

    def test_create_sets_all_attributes
      assert_difference ::ApiDocs::Service.method(:count) do
        post admin_api_backend_api_active_docs_path(create_params(backend_api_id: backend_api.id, system_name: 'smart_service'))
        assert_response :created
      end

      api_docs_backend_api = provider.api_docs_backend_apis.last!
      assert_equal 'smart_service', api_docs_backend_api.system_name
      create_params[:api_docs_backend_api].each do |name, value|
        expected_value = %i[published skip_swagger_validations].include?(name) ? (value == '1') : value
        assert_equal expected_value, api_docs_backend_api.public_send(name)
      end
      assert_equal provider.id, api_docs_backend_api.account_id
    end

    def test_update_with_right_params
      put admin_api_backend_api_active_doc_path(api_docs_backend_api), update_params(name: 'test-update')
      assert_response :success

      api_docs_backend_api.reload
      assert_equal 'test-update', api_docs_backend_api.name
    end

    def test_system_name_is_not_updated
      origin_system_name = api_docs_backend_api.system_name
      put admin_api_backend_api_active_doc_path(api_docs_backend_api), update_params(system_name: 'test-update-system-name')
      assert_response :success

      api_docs_backend_api.reload
      assert_not_equal 'test-update-system-name', api_docs_backend_api.system_name
      assert_equal origin_system_name, api_docs_backend_api.system_name
    end

    def test_update_invalid_params
      old_body = api_docs_backend_api.body
      put admin_api_backend_api_active_doc_path(api_docs_backend_api), update_params(body: '{apis: []}')
      assert_response :unprocessable_entity

      api_docs_backend_api.reload
      assert_match 'JSON Spec is invalid', response.body
      assert_equal old_body, api_docs_backend_api.body
    end

    private

    def create_params(additional_params = {})
      api_docs_params(additional_params)
    end

    def update_params(additional_params = {})
      api_docs_params(additional_params).merge({ id: api_docs_backend_api.id })
    end

    def api_docs_params(additional_params = {})
      { 
        api_docs_backend_api: {
          name: 'update_servone',
          body: '{"apis": [{"foo": "bar"}], "basePath": "http://example.net"}',
          description: 'updated description',
          published: '1',
          skip_swagger_validations: '0'
        }.merge(additional_params)
      }
    end
  end
end
