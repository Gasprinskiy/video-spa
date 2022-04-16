
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