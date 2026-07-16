import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const apiToken = formData.get('apiToken') as string;
    const accountId = formData.get('accountId') as string;
    const projectName = formData.get('projectName') as string;
    const files = formData.getAll('files') as File[];

    // Validate inputs
    if (!apiToken || !accountId || !projectName || !files.length) {
      return NextResponse.json(
        { message: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Validate project name format
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(projectName)) {
      return NextResponse.json(
        { message: 'اسم المشروع يجب أن يكون بصيغة صحيحة (حروف صغيرة وأرقام وشرطات فقط)' },
        { status: 400 }
      );
    }

    // Create FormData for Cloudflare API
    const cloudflareFormData = new FormData();
    
    // Add files to FormData
    for (const file of files) {
      cloudflareFormData.append('files', file, file.name);
    }

    // Upload to Cloudflare Pages
    const uploadResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/rollback`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: cloudflareFormData,
      }
    );

    // Check if project exists first, if not create it
    if (uploadResponse.status === 404) {
      // Try to create the project first
      const createResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: projectName,
            production_branch: 'main',
          }),
        }
      );

      if (!createResponse.ok) {
        return NextResponse.json(
          { message: 'فشل إنشاء المشروع. تحقق من بيانات Cloudflare.' },
          { status: 400 }
        );
      }

      // Now upload the deployment
      const deploymentResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments/rollback`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
          body: cloudflareFormData,
        }
      );

      if (!deploymentResponse.ok) {
        const error = await deploymentResponse.json();
        return NextResponse.json(
          { message: 'فشل النشر. ' + (error.errors?.[0]?.message || '') },
          { status: 400 }
        );
      }

      const deploymentData = await deploymentResponse.json();
      return NextResponse.json({
        message: 'تم النشر بنجاح',
        url: `https://${projectName}.pages.dev`,
        deployment: deploymentData.result,
      });
    }

    if (!uploadResponse.ok) {
      const error = await uploadResponse.json();
      return NextResponse.json(
        { message: 'فشل النشر. تحقق من بيانات Cloudflare.' },
        { status: 400 }
      );
    }

    const responseData = await uploadResponse.json();

    return NextResponse.json({
      message: 'تم النشر بنجاح',
      url: `https://${projectName}.pages.dev`,
      deployment: responseData.result,
    });
  } catch (error: any) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم: ' + error.message },
      { status: 500 }
    );
  }
}
