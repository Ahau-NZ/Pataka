<template>
  <div class="container">
    <div v-if="isLoading" class="splash">
      <img src="@/assets/logo_red.svg" />
      <h1>Āhau Pātaka</h1>
    </div>
    <div v-if="!isLoading && !isSetup" class="welcome-text" style="justify-items:center;display: grid;">
      <v-row>
        <p class="mb-0 headliner">Nau mai</p>
      </v-row>
      <v-row>
        <p class="mb-0 headliner">Whakatau mai</p>
      </v-row>
      <v-row class="pb-12">
        <p style="color:darkgrey" class="mb-0 headliner2">welcome</p>
      </v-row>
      <v-row class="mt-10">
        <v-btn
          text
          x-large
          color="#b12526"
          style="border-color:#b12526; background-color: #303030;"
          @click.prevent="toggleNew"
          outlined
        >
            <p class="login-text mb-0">create pataka</p>

        </v-btn>
      </v-row>
    </div>
    <div v-else-if="!isLoading && isSetup" class="welcome-text" style="justify-items:center;display: grid;">
      <v-row class="pb-12">
        <p style="color:darkgrey" class="mb-0 headliner2">enter password</p>
      </v-row>
      <v-row class="mt-10">
        <v-col cols="12">
          <v-text-field
            v-model="passwordInput"
            label="Password" outlined
            style="background-color: #303030; width:300px"
            width="150px"
            type="password"
            :error-messages="passwordRules"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          text
          color="#b12526"
          style="border-color:#b12526; background-color: #303030;"
          @click.prevent="checkPassword"
          outlined

        >
            <p class="login-text mb-0">submit</p>

        </v-btn>
      </v-row>
    </div>
    <!-- <v-btn v-if="!isLoading && !isSetup" text x-large color="#b12526" @click.prevent="toggleNew">
      <v-icon left>mdi-plus</v-icon>
      <p class="mb-0">Create Pātaka</p>
    </v-btn> -->
    <NewNodeDialog
      v-if="dialog"
      :show="dialog"
      :title="`Āhau Pātaka`"
      @close="toggleNew"
      @create="save($event)"
    />
  </div>
</template>

<script>
import NewNodeDialog from '@/components/NewNodeDialog.vue'
import gql from 'graphql-tag'
import pick from 'lodash.pick'
import { password } from '@/lib/file-helpers'
import bcrypt from 'bcryptjs'

const karakia = `
---------------------------------
E te tangata
Whāia te māutauranga kai mārama
Kia whai take ngā mahi katoa
Tū māia, tū kaha
Aroha atu, aroha mai
Tātou i a tātou katoa

For this person
Seek knowledge for understanding
Have purpose in all that you do
Stand tall, be strong
Lets us all show respect
For each other
---------------------------------
`

export default {
  data () {
    return {
      isLoading: true,
      isSetup: false, // has profile set up
      profile: {
        id: null,
        preferredName: null,
        avatarImage: null
      },
      dialog: false,
      passwordInput: '',
      passwordError: false,
      passwordRules: []
    }
  },
  mounted () {
    this.getCurrentIdentity()
  },
  methods: {
    async createPassword (text) {
      await bcrypt.hash(text, 10, function(err, hash) {
        if (err) {console.log("error encrypting password: ", err)}
        else console.log("hash: ", hash)
      })
    },
    checkPassword () {
      bcrypt.compare(this.passwordInput, password).then((res) => {
          if (res) {
            this.karakiaTūwhera()
            this.$router.push({ name: 'dashboard' })
          }
          else this.passwordRules.push('Password incorrect. Try again')
      });
    },
    async getCurrentIdentity () {
      const result = await this.$apollo.query({
        query: gql`
          {
            whoami {
              public {
                profile {
                  id
                  preferredName
                  avatarImage {
                    uri
                  }
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })

      if (result.errors) throw result.errors

      if (result.data.whoami.public.profile) this.profile = result.data.whoami.public.profile
      this.proceed()
    },

    karakiaTūwhera () {
      console.log(karakia)
    },

    proceed () {
      if (this.$apollo.loading || !this.profile.id) {
        console.log('waiting for apollo')
        setTimeout(this.proceed, 300)
        return
      }

      this.isSetup = Boolean(this.profile.preferredName)

      // if (this.isSetup) {
      //   this.karakiaTūwhera()
      //   this.$router.push({ name: 'dashboard' })
      // }

      // Shortcut in dev, that saves us from doing one click when testing
      // if (this.isSetup && process.env.NODE_ENV === 'development') {
      //   this.karakiatūwhera()
      //   this.$router.push({ name: 'dashboard' })
      // }

      this.isLoading = false
    },

    toggleNew () {
      this.dialog = !this.dialog
    },

    async save (profileChanges) {
      const newProfile = pick(profileChanges,
        'preferredName',
        'description',
        'avatarImage'
      )
      // TODO replace this with graphql mixin?
      if (newProfile.avatarImage) delete newProfile.avatarImage.uri

      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($input: ProfileInput!) {
            saveProfile(input: $input)
          }
        `,
        variables: {
          input: {
            id: this.profile.id,
            ...newProfile,
            allowPublic: true
          }
        }
      })

      if (result.errors) {
        console.error('failed to update profile', result)
        return
      }

      this.getCurrentIdentity()
    }
  },
  components: {
    NewNodeDialog
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  text-transform: uppercase;
  letter-spacing: 0.5vw;
  text-align: center;
  padding-top: 15%;
}
.container {
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.splash {
  min-height: 20vh;
  width: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.name {
  font-size: 1em;
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: 3px;
  color: white;
}
.body-width {
  max-width: 900px;
}
.button:hover {
  cursor: pointer;
}

.welcome-text {
  position: relative;
  top: -10%;
}

 .headliner {
    font-size: 1.5em;
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 5px;
  }

 .headliner2 {
    padding-top: 50px;
    font-size: 1.5em;
    text-transform: uppercase;
    font-weight: 300;
    letter-spacing: 3px;
  }

  .login-text {
    font-weight: 500;
  }
</style>
