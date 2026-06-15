import { Document, Page, Text, View, StyleSheet, renderToStream } from '@react-pdf/renderer';
import type { CaseStudyWithPhases } from '@/types';
import { formatPhaseToPlainText } from './formatters';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#8B5CF6' },
  text: { fontSize: 11, lineHeight: 1.5, color: '#333', marginBottom: 8 },
});

const PDFDocument = ({ caseStudy, type }: { caseStudy: CaseStudyWithPhases; type: string }) => {
  let includedPhases = [1, 2, 3, 4, 5, 6, 7];
  let docTitle = caseStudy.title;
  
  if (type === 'summary') { includedPhases = [1, 3, 7]; docTitle += ' - Executive Summary'; }
  else if (type === 'strategy') { includedPhases = [3, 4]; docTitle += ' - Product Strategy'; }
  else if (type === 'prd') { includedPhases = [5, 6]; docTitle += ' - PRD'; }
  else if (type === 'roadmap') { includedPhases = [7]; docTitle += ' - Roadmap'; }

  const phasesToRender = caseStudy.phases.filter(p => includedPhases.includes(p.phase)).sort((a, b) => a.phase - b.phase);

  return (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{docTitle}</Text>
      <Text style={styles.subtitle}>{caseStudy.description || 'PM Case Studio Report'}</Text>

      {phasesToRender.length === 0 && (
        <Text style={styles.text}>No data available for this document type.</Text>
      )}

      {phasesToRender.map((p) => {
        const contentStr = formatPhaseToPlainText(p.phase, p.data);
        const lines = contentStr.split('\n').filter(Boolean);

        return (
          <View key={p.phase} wrap={false}>
            <Text style={styles.sectionTitle}>Phase {p.phase}</Text>
            {lines.map((line, i) => (
              <Text key={i} style={styles.text}>{line}</Text>
            ))}
          </View>
        );
      })}
    </Page>
  </Document>
  );
};

export async function generatePDF(caseStudy: CaseStudyWithPhases, type = 'pdf'): Promise<Buffer> {
  const stream = await renderToStream(<PDFDocument caseStudy={caseStudy} type={type} />);
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
