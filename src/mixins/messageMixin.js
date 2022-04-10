import { apiRequest } from '../apiWorkers/apiRequest'

export default {
    data() {
        return {
            request: {
                loading: false,
                initiator: null,
                autoErrorHandling: false,
                status: 'pending'
            }
        }
    },

    methods: {
        prepareRequest() {
            const { httpQuery, autoErrorHandling } = this.requestBuilder()
            this.request.autoErrorHandling = autoErrorHandling
            this.request.initiator = httpQuery.initiator
            this.request.options = httpQuery.options
        },

        async makeRequest() {
            try {
                this.request.status = 'loading'
                this.request.loading = true
                this.prepareRequest()

                const response = await apiRequest(this.request.initiator, this.request.options)
                this.requestSuccess(response)
            } catch (error) {
                this.request.status = 'error'
                this.requestFailed(error)

                if (this.request.autoErrorHandling) {
                    this.$q.notify({
                        message: error,
                        color: 'negative'
                    })
                }

            } finally {
                this.request.loading = false
            }
        },

        requestBuilder() {
            throw 'requestBuilder not defined'
        },

        requestSuccess() {
            throw 'successRequest not defined'
        },

        requestFailed() {
            throw 'failedRequest request not defined'
        }
    },
}