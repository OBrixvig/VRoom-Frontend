export default {
    name: 'ConfirmModal',
    props: {
        id: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            default: 'Er du sikker?',
        },
        confirmText: {
            type: String,
            default: 'Bekræft',
        },
        cancelText: {
            type: String,
            default: 'Afbryd',
        },
    },
    methods: {
        confirm() {
            this.$emit('confirm');
            this.close();
        },
        cancel() {
            this.$emit('cancel');
            this.close();
        },
        close() {
            const modal = bootstrap.Modal.getInstance(document.getElementById(this.id));
            modal.hide();
        },
    },
    template: `
        <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmModalLabel">Bekræft handling</h5>
                        <button type="button" class="btn-close" @click="cancel" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        {{ message }}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="cancel">{{ cancelText }}</button>
                        <button type="button" class="btn btn-primary" @click="confirm">{{ confirmText }}</button>
                    </div>
                </div>
            </div>
        </div>
    `,
};