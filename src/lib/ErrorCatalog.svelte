<script lang="ts">
  import DocumentPage from './DocumentPage.svelte';
  import catalog from './generated/catalog.json';
  import type { PortalPageData } from './server/page';
  let { status = 404 }: { status?: number } = $props();
  const data = $derived({
    page: { ...catalog.page, title: status === 404 ? 'Page not found' : 'Something went wrong' },
    course: null,
    courseTree: [],
    courses: catalog.courses,
    titleHeading: null,
    articleHtml: `<p role="status" class="mb-6 text-muted-contrast">${status === 404 ? 'Page not found. Choose a course below.' : 'Something went wrong. Choose a course below.'}</p>${catalog.page.html}`,
    breadcrumb: [],
    treePaths: {},
    previous: null,
    next: null,
    previousFromParent: false,
    nextFromParent: false
  } satisfies PortalPageData);
</script>
<DocumentPage {data}/>
