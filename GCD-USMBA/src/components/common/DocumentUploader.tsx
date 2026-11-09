import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { ApplicationDocument } from '../../types';

interface DocumentUploaderProps {
  document: ApplicationDocument;
  onUpload: (docId: string, file: { fileName: string; fileSize: number; fileUrl: string }) => void;
  readOnly?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  document,
  onUpload,
  readOnly = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulatedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (!ext || !allowedExtensions.includes(ext)) {
      setError('Format non autorisé. Formats acceptés : PDF, JPG, PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Le fichier dépasse la taille maximale autorisée (5 Mo).');
      return;
    }

    onUpload(document.id, {
      fileName: file.name,
      fileSize: file.size,
      fileUrl: URL.createObjectURL(file)
    });
  };

  const getStatusBadge = () => {
    switch (document.status) {
      case 'valide':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Conforme & Validé
          </span>
        );
      case 'rejete':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            Pièce rejetée
          </span>
        );
      case 'manquant':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Pièce manquante
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            <FileText className="w-3.5 h-3.5" />
            Téléversé (En attente d'instruction)
          </span>
        );
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        document.status === 'rejete'
          ? 'border-rose-300 bg-rose-50/40'
          : document.status === 'manquant'
          ? 'border-amber-300 bg-amber-50/30'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">{document.label}</span>
            {document.isRequired && (
              <span className="text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                Obligatoire
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Format max : 5 Mo (PDF, JPG, PNG)</span>
            <span>•</span>
            {getStatusBadge()}
          </div>
          {document.rejectionReason && (
            <div className="mt-1 text-xs text-rose-700 font-medium bg-rose-100/70 p-2 rounded-lg border border-rose-200">
              <strong>Motif du rejet :</strong> {document.rejectionReason}
            </div>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-2">
            {document.fileName ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg max-w-[180px] truncate border border-slate-200">
                  {document.fileName}
                </span>
                <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-xs">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  Remplacer
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleSimulatedFile}
                  />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-lg transition-all shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Téléverser la pièce
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleSimulatedFile}
                />
              </label>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-600 font-medium flex items-center gap-1">
          <AlertTriangle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
