<template>
  <v-row>

    <v-col cols="12" md="8">
      <div class="graph" :style="graphStyle">
        <div class='detail'>
          <strong class="mr-2">{{ fileSystemStats.use }}%</strong>
          <span class="mount">{{ fileSystemStats.mount }}</span>
        </div>
        <div class="other" />
        <div class="ahau" />
        <div class="free" />
      </div>
    </v-col>

    <v-col cols="12" md="8">
      <v-simple-table dense>
        <template v-slot:default>
          <tbody>
            <tr v-for="item in stats" :key="item.name" >
              <td><div :class='"key " + item.key' /></td>
              <td>{{ item.label }}</td>
              <td>{{ item.size }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import gql from 'graphql-tag'

// const GB = 1024 * 1024 * 1024

export default {
  name: 'StorageGraph',
  data () {
    return {
      ahauDBStats: {
        size: 0,
        hyperBlobStats: {
          size: 0
        }
      },
      fileSystemStats: {
        size: 0,
        use: 0,
        available: 0,
        used: 0,
        mount: ''
      }
    }
  },
  apollo: {
    ahauDBStats: {
      query: gql`
        query {
          ahauDBStats {
            size
            hyperBlobStats {
              size
            }
          }
        }
      `,
      fetchPolicy: 'no-cache'
    },
    fileSystemStats: {
      query: gql`
        query {
          fileSystemStats {
            size
            use
            available
            used
            mount
          }
        }
      `,
      fetchPolicy: 'no-cache'
    }
  },
  computed: {
    stats () {
      return [
        {
          key: 'ahau',
          label: 'ahau storage',
          size: this.ahauUsage
        },
        {
          key: 'free',
          label: 'disk storage',
          size: this.diskSpaceAvailable
        }
      ]
    },
    graphStyle () {
      const ahau = this.ahauDBStats.size
      const other = this.fileSystemStats.used - ahau
      const free = this.fileSystemStats.available

      return {
        gridTemplateColumns: `${other}fr ${ahau}fr ${free}fr`
      }
    },
    diskSpaceAvailable () {
      return this.convertBytesToGb(this.fileSystemStats.available)
    },
    ahauUsage () {
      return this.convertBytesToGb(this.ahauDBStats.size)
    }
  },
  methods: {
    convertBytesToGb (bytes) {
      return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
    }
  }
}
</script>

<style scoped lang="scss">
.other { background: rgba(95, 125, 139, 1); }
.ahau { background: var(--v-accent-base); }
.free { background: rgba(96, 125, 139, 0.3); }

.graph {
  display: grid;
  grid-template-rows: auto 10px;

  .detail {
    grid-column: 1 / 4;
  }
}

table {
  .key {
    width: 10px;
    height: 10px;
  }
}

</style>
