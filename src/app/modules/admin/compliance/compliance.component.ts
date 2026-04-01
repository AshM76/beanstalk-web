import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment'

interface EulaDocument {
  eula_id: string;
  eula_type: string;
  version: string;
  is_current_version: boolean;
  effective_date: Date;
  created_at: Date;
  change_summary: string;
}

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss'],
})
export class ComplianceComponent implements OnInit {
  documents: EulaDocument[] = [];
  loading = true;
  error: string | null = null;
  selectedType = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.error = null;

    this.http.get<any>(`${environment.baseUrl}/api/compliance/documents`).subscribe({
      next: (response) => {
        this.documents = response.data.documents || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load EULA documents:', err);
        this.error = 'Failed to load EULA documents';
        this.loading = false;
      },
    });
  }

  getFilteredDocuments(): EulaDocument[] {
    if (this.selectedType === 'all') {
      return this.documents;
    }
    return this.documents.filter((doc) => doc.eula_type === this.selectedType);
  }

  getDocumentIcon(type: string): string {
    const icons: Record<string, string> = {
      terms_of_service: 'description',
      privacy_policy: 'privacy_tip',
      contest_rules: 'gavel',
    };
    return icons[type] || 'document';
  }
}
