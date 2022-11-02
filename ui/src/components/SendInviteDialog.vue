<template>
  <Dialog :show="show" :title="title" width="45vw" :goBack="close" enableMenu @close="close" hideActions>
    <template v-slot:content>
      <v-row class="mx-2">
        <v-col cols="12">
          <v-row>
           <v-col cols="12" class="mt-4">
            <p v-if="uses > 1">Enter email addresses</p>
            <p v-else>Enter email address</p>
            <v-text-field
              ref="input"
              v-model="input"
              @keyup.space="add"
              @keyup.delete="removeLast"
              @focus="inputActive = true"
              @blur="inputActive = false"
              :messages="messages"
            >
              <template v-slot:prepend-inner>
                <div v-for="(email , index) in invitees" :key="index">
                  <v-chip
                    class="ma-1"
                    close
                    @click:close="remove(email)"
                  >
                    {{ email }}
                  </v-chip>
                </div>
              </template>
            </v-text-field>
          </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="mx-2">
        <v-col style="margin-bottom:20px" align="left" class="py-0">
          <v-btn
            class="white--text"
            color="black"
            @click="send()"
            v-if="!sending"
          >
           <v-icon small>mdi-send</v-icon> <span class="pl-2"> send</span>
          </v-btn>
          <v-progress-circular
            v-else
            width="2"
            indeterminate
            color="#0484c4"
          ></v-progress-circular>
          <p v-if="errorMsg" class="red--text" >{{ errorMsg }}</p>
        </v-col>
      </v-row>
    </template>
  </Dialog>
</template>

<script>
import Dialog from './Dialog.vue'

export default {
  name: 'SendInviteDialog',
  components: {
    Dialog
  },
  props: {
    show: { type: Boolean, required: true },
    title: String,
    code: String,
    uses: Number,
    name: String
  },
  data () {
    return {
      invitees: [],
      input: '',
      inputActive: false,
      canPop: false,
      count: 0,
      errorMsg: null,
      sending: false
    }
  },
  computed: {
    messages () {
      return this.uses === 1 ? 'Code limited to a single use' : ''
    }
  },
  methods: {
    add () {
      if (this.input.length) {
        if (this.uses > 1 || !this.invitees.length) this.invitees.push(this.input)
        this.input = ''
        this.count = 0
      }
      setTimeout(() => this.$refs.input.focus(), 100)
    },
    send () {
      this.sending = true
      const obj = {
        emails: this.invitees.length ? this.invitees : this.input,
        code: this.code,
        name: this.name
      }
      const data = new FormData()
      data.append('json', JSON.stringify(obj))
      fetch('https://ahau.io/sendInvite', {
      // fetch("http://localhost:5000/sendInvite", { // for dev testing
        method: 'post',
        body: data

      }).then((res) => {
        if (res.status === 200) {
          this.sending = false
          this.$emit('codeSent')
          this.close()
        } else {
          this.sending = false
          this.errorMsg = 'Error sending code. Please send manually'
        }
      })
      this.$emit('codeSent')
      this.close()
    },
    close () {
      this.errorMsg = null
      this.$emit('close')
    },
    remove (item) {
      this.invitees.splice(this.invitees.indexOf(item), 1)
    },
    removeLast () {
      if (this.$refs.input.focus && !this.input.length && this.invitees.length) {
        this.count++
        if (this.count > 1) this.invitees.pop()
        setTimeout(() => this.$refs.input.focus(), 100)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
