import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './auth.service';

@Directive({
    selector: '[authorized]'
})
export class AuthorizedDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private auth: AuthService
    ) { }

    action: string = '';

    @Input() set authorized(action: string) {
        this.action = action;

    }

    ngOnInit() {
        const accountType: string = this.auth.accountType;
        if (accountType === 'main') {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else if (accountType === 'secondary' && this.action === 'details') {
            this.viewContainer.createEmbeddedView(this.templateRef);
        }
    }
}
