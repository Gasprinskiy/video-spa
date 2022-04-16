
export default {
    data(){
        return {
            message: '',
            errorMessege: '',
            isError: false,
            isWarn: false,
            isSuccess: false,
        }
    },

    watch: {
        message(){
            if(this.message !== ''){
               this.$q.notify({
                    message: this.message,
                    color: this.messageColor
                })
            }
            this.message = ''
        },

    },

    computed: {
        messageColor(){
            if(this.isError){
                this.isError = false
                return 'red'
            }else if(this.isWarn){
                this.isWarn = false
                return 'orange'
            } else if(this.isSuccess){
                this.isSuccess = false
                return 'green'
            }
        }
    }
}

// requset Mixin 

// import { apiRequest } from '../apiWorkers/apiRequest'

// export default {
//     data() {
//         return {
//             request: {
//                 loading: false,
//                 initiator: null,
//                 autoErrorHandling: false,
//                 status: 'pending'
//             }
//         }
//     },

//     methods: {
//         prepareRequest() {
//             const { httpQuery, autoErrorHandling } = this.requestBuilder()
//             this.request.autoErrorHandling = autoErrorHandling
//             this.request.initiator = httpQuery.initiator
//             this.request.options = httpQuery.options
//         },

//         async makeRequest() {
//             try {
//                 this.request.status = 'loading'
//                 this.request.loading = true
//                 this.prepareRequest()

//                 const response = await apiRequest(this.request.initiator, this.request.options)
//                 this.requestSuccess(response)
//             } catch (error) {
//                 this.request.status = 'error'
//                 this.requestFailed(error)

//                 if (this.request.autoErrorHandling) {
//                     this.$q.notify({
//                         message: error,
//                         color: 'negative'
//                     })
//                 }

//             } finally {
//                 this.request.loading = false
//             }
//         },

//         requestBuilder() {
//             throw 'requestBuilder not defined'
//         },

//         requestSuccess() {
//             throw 'successRequest not defined'
//         },

//         requestFailed() {
//             throw 'failedRequest request not defined'
//         }
//     },
// }
