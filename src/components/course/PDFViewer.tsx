"use client";

import { useState, useEffect } from "react";
import { Content } from "@/types";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, AlertCircle, RefreshCw, Loader2 } from "lucide-react";

interface PDFViewerProps {
	content: Content;
}

export function PDFViewer({ content }: PDFViewerProps) {
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [retryKey, setRetryKey] = useState(0);

	useEffect(() => {
		let objectUrl: string | null = null;

		const loadPDF = async () => {
			try {
				setLoading(true);
				setHasError(false);

				if (!content.pdf_url) {
					setHasError(true);
					setLoading(false);
					return;
				}

				// Fetch the PDF as a blob to bypass Content-Disposition header
				const response = await fetch(content.pdf_url);
				
				if (!response.ok) {
					throw new Error('Failed to load PDF');
				}

				const blob = await response.blob();
				
				// Create a blob URL
				objectUrl = URL.createObjectURL(blob);
				setBlobUrl(objectUrl);
				setLoading(false);
			} catch (err) {
				console.error('Error loading PDF:', err);
				setHasError(true);
				setLoading(false);
			}
		};

		loadPDF();

		// Cleanup: revoke the blob URL when component unmounts or content changes
		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	}, [content.pdf_url, retryKey]);

	const handleRetry = () => {
		setBlobUrl(null);
		setRetryKey(prev => prev + 1);
	};

	if (!content.pdf_url) {
		return (
			<div className="bg-muted rounded-sm p-8 text-center">
				<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
				<p className="text-muted-foreground">PDF not available</p>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="border rounded-sm overflow-hidden bg-white flex items-center justify-center" style={{ height: "600px" }}>
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<p className="text-sm text-muted-foreground">Loading PDF...</p>
				</div>
			</div>
		);
	}

	if (hasError || !blobUrl) {
		return (
			<div className="bg-muted rounded-sm p-8 text-center space-y-4">
				<AlertCircle className="h-12 w-12 text-destructive mx-auto" />
				<div>
					<p className="text-destructive font-medium">Failed to load PDF</p>
					<p className="text-sm text-muted-foreground mt-1">
						The PDF could not be displayed. Please try refreshing or download it instead.
					</p>
				</div>
				<div className="flex justify-center gap-2">
					<Button onClick={handleRetry} variant="outline" className="rounded-sm">
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
					<Button asChild variant="default" className="rounded-sm">
						<a href={content.pdf_url} download={content.pdf_filename || 'document.pdf'}>
							<Download className="mr-2 h-4 w-4" />
							Download PDF
						</a>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* PDF Display - Using blob URL like CertificateViewer */}
			<div className="border rounded-sm overflow-hidden bg-white" style={{ height: "600px" }}>
				<iframe
					src={blobUrl}
					className="w-full h-full"
					title={content.title}
					style={{ border: 'none' }}
				/>
			</div>

			{/* Actions */}
			<div className="flex justify-between items-center gap-4">
				<Button asChild variant="outline" className="rounded-sm">
					<a href={content.pdf_url} target="_blank" rel="noopener noreferrer">
						<ExternalLink className="mr-2 h-4 w-4" />
						Open in New Tab
					</a>
				</Button>
				<Button asChild variant="outline" className="rounded-sm">
					<a href={content.pdf_url} download={content.pdf_filename || 'document.pdf'}>
						<Download className="mr-2 h-4 w-4" />
						Download PDF
					</a>
				</Button>
			</div>
		</div>
	);
}
