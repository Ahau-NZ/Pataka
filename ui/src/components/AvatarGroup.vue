<template>
  <v-col class="pt-0 pb-0">
    <v-row v-if="groupTitle">
      <v-col class="pt-1 pb-0">
        <small class="label overline"> {{ groupTitle }} </small>
      </v-col>
    </v-row>

    <v-row :class="customClass">
      <div
        width="100%"
        :class="spacing"
        v-for="(profile, i) in profiles"
        :key="`${groupTitle}-${i}`"
      >
        <div justify="center" class="pt-2">
          <Avatar
            :size="size"
            :isEditing="false"
            :type="profile.type"
            :image="profile.avatarImage"
            :alt="profile.preferredName"
            :gender="profile.gender"
            :showLabel="showLabels"
            :clickable="clickable"
            :deletable="deletable"
            :dark="dark"
            :row="row"
            :tile="tile"
            :offline="profile.isOnline === undefined ? true : !profile.isOnline"
            @click="profileClick(profile)"
            @delete="$emit('delete', i)"
          />
        </div>
      </div>
      <slot name="action"></slot>
    </v-row>
  </v-col>
</template>

<script>
import Avatar from './Avatar.vue'
export default {
  name: 'AvatarGroup',
  components: {
    Avatar
  },
  props: {
    profiles: { type: Array, default: null },
    groupTitle: { type: String, default: null },
    showLabels: { type: Boolean, default: true },
    size: { type: String, default: '80px' },
    customClass: { type: String, default: 'd-flex justify-start align-center pa-2 pl-4' },
    spacing: { type: String, default: 'pr-5' },
    deletable: Boolean,
    tile: Boolean,
    clickable: { type: Boolean, default: true },
    dark: Boolean,
    row: Boolean
  },
  computed: {
    columns () {
      return this.profiles.length
    }
  },
  methods: {
    profileClick (profile) {
      this.$emit('profile-click', profile)
    }
  }
}
</script>
<style scoped lang="scss">

* {
  color: #383838
}

.label {
  color: rgba(0,0,0,0.6);
  font-size: 65% !important;
}

</style>
