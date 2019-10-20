<script>
  import vPaging from './Paging';
  export default {
		computed: {
			tableData() {
				return this.$store.state.tableData;
			},
			pager() {
				return this.$store.state.pager
			},
			assetsData(){
				return this.$store.state.assetsData;
      }
		},
  	components: {
			vPaging
    },
		watch: {
			pager: {
				handler:function(newValue, oldValue) {
					this.getData()
				},
				deep: true
			}
		},
		created() {
			this.getData()
		},
    methods: {
			tableHeaderColor({row, column, rowIndex}) {
				if (rowIndex === 0) {
					return 'background-color: rgb(244,246,249);color: #000;font-weight: 500;'
				}
			},
    },
		beforeDestroy() {
			this.$store.dispatch('initiValue');
		}
  }
</script>
