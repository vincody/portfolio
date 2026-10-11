import {test,expect} from '@playwright/test';
test('character blinks, breathes and types only while visible with motion enabled',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 const hero=page.locator('.hero-art .character-scene'),portrait=page.locator('.about-art .character-scene');
 await expect(hero).toHaveAttribute('data-idle','active');await expect(portrait).toHaveAttribute('data-idle','paused');
 const breathing=hero.locator('.character-idle-body'),hand=hero.locator('.character-hand-right');
 expect(await breathing.evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('running');
 const rotation=await hand.evaluate(el=>getComputedStyle(el).transform);
 await expect.poll(()=>hand.evaluate(el=>getComputedStyle(el).transform)).not.toBe(rotation);
 await expect.poll(()=>hero.locator('.character-eyes').evaluate(el=>el.classList.contains('is-blinking')),{timeout:8000,intervals:[50]}).toBe(true);
 await expect(hero.locator('.character-eyes')).not.toHaveClass(/is-blinking/);
 await page.screenshot({path:'artifacts/character-idle.png'});
 await page.locator('#about').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await expect(hero).toHaveAttribute('data-idle','paused');await expect(portrait).toHaveAttribute('data-idle','active');
 expect(await hand.evaluate(el=>getComputedStyle(el).animationPlayState)).toBe('paused');
 await expect(portrait.locator('.character-hand')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await expect(page.locator('.character-scene[data-idle="active"]')).toHaveCount(0);
 expect(await breathing.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 expect(await hand.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
 await expect(page.locator('.character-eyes.is-blinking')).toHaveCount(0);
});
test('chapters fade outside the reading area, track navigation, and respect mobile and reduced motion',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'no-preference'});await page.goto('/');
 const opacity=id=>page.locator(id).evaluate(el=>Number(getComputedStyle(el).opacity));
 await page.locator('#about').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await expect.poll(()=>opacity('#about')).toBe(1);
 await expect(page.locator('header .header-inner > nav a[aria-current="location"]')).toHaveAttribute('href','#about');
 await page.locator('#skills').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await expect.poll(()=>opacity('#skills')).toBe(1);await expect.poll(()=>opacity('#about')).toBeLessThan(.2);
 await expect(page.locator('header .header-inner > nav a[aria-current="location"]')).toHaveAttribute('href','#skills');
 expect(await page.locator('#about').evaluate(el=>getComputedStyle(el).display)).not.toBe('none');
 await expect.poll(()=>page.locator('.page-intro').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(0);
 await expect.poll(()=>page.locator('#skills .skills-grid > div').evaluateAll(els=>els.filter(el=>{const box=el.getBoundingClientRect();return box.top<innerHeight&&box.bottom>88;}).every(el=>Number(getComputedStyle(el).opacity)===1))).toBe(true);
 await page.screenshot({path:'artifacts/chapters-skills.png'});
 await page.setViewportSize({width:375,height:812});await expect.poll(()=>opacity('#about')).toBe(1);
 expect(await page.locator('#about').evaluate(el=>getComputedStyle(el).minHeight)).toBe('0px');
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 await expect.poll(()=>opacity('#about')).toBe(1);expect(await page.locator('#about').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('personal name and full role are displayed in the correct order in both languages',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('.hero-name')).toHaveText('Nguyễn Phú Vinh.');
 await expect(page.locator('.hero-cloud-role')).toHaveText('Cloud & Infrastructure Engineer');
 await expect(page.locator('footer')).toContainText('Nguyễn Phú Vinh');
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();await expect(page.locator('.hero-cloud-role')).toHaveText('Kỹ sư Cloud & Hạ tầng');
 await page.setViewportSize({width:375,height:812});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('portfolio follows introduction, about, skills, certifications, projects, contact',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 expect(await page.locator('main > section').evaluateAll(sections=>sections.map(s=>s.id))).toEqual(['home','about','skills','experience','certifications','projects','contact']);
 await expect(page.locator('#about')).toContainText('AWS');await expect(page.locator('#about')).toContainText('automation');
 expect(await page.locator('header .header-inner > nav a').evaluateAll(links=>links.map(a=>a.getAttribute('href')))).toEqual(['#about','#skills','#experience','#certifications','#projects','#contact']);
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();await expect(page.locator('#about')).toContainText('khả năng quan sát');
});
test('technology logos load and certification links to the supplied Credly badge',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.locator('#skills .skill-logo img')).toHaveCount(8);
 expect(await page.locator('#skills .skill-logo img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0))).toBe(true);
 const cert=page.locator('#certifications');await cert.scrollIntoViewIfNeeded();await expect(cert.getByRole('heading',{name:'AWS Certified Cloud Practitioner',exact:true})).toBeVisible();
 const link=cert.getByRole('link',{name:'Verify on Credly',exact:true});await expect(link).toHaveAttribute('href','https://www.credly.com/badges/bddba3a8-8c81-4882-9382-352f6247ba9e/public_url');await expect(link).toHaveAttribute('target','_blank');
 await expect.poll(()=>cert.locator('img').evaluate(img=>img.complete&&img.naturalWidth>0)).toBe(true);
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();await expect(cert.getByRole('link',{name:'Xác minh trên Credly',exact:true})).toBeVisible();
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:1440,height:900});await cert.screenshot({path:'artifacts/certification.png'});
});
test('AWS-led cloud portfolio shows the stated toolset in EN and VI',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Cloud & Infrastructure');
 for(const skill of ['AWS','Azure','Docker','Kubernetes','Terraform','Prometheus','Grafana','CI/CD','Git','Automation'])await expect(page.locator('#skills').getByRole('heading',{name:skill,exact:true})).toBeVisible();
 await expect(page.locator('#skills')).toContainText('Primary platform');await expect(page.locator('#skills')).toContainText('Secondary platform');
 await expect(page.locator('#experience')).toHaveCount(1);await expect(page.locator('#about')).toContainText('Prometheus');
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toContainText('Cloud & Hạ tầng');await expect(page.locator('#skills')).toContainText('Nền tảng chính');await expect(page.locator('#skills')).toContainText('Tự động hóa');
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
});
test('first screen contains only hero and Vietnamese layouts fit all viewports',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 for(const language of ['English','Tiếng Việt']){
  await page.getByRole('button',{name:language,exact:true}).click();
  if(language==='Tiếng Việt')await page.evaluate(()=>document.fonts.load('16px "JetBrains NF Mono"','Tiếng Việt'));
  for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   const skills=await page.locator('#skills').boundingBox();expect(skills.y).toBeGreaterThanOrEqual(899);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   const actions=await page.locator('.header-actions').boundingBox();expect(actions.x+actions.width).toBeLessThanOrEqual(width);
  }
 }
 await page.setViewportSize({width:1440,height:900});await page.screenshot({path:'artifacts/vi-desktop.png',fullPage:true});await page.setViewportSize({width:375,height:812});await page.screenshot({path:'artifacts/vi-mobile.png',fullPage:true});
});
test('character tilts on mouse, resets on leave, and stays still with reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});await page.goto('/');
 const scene=page.locator('.character-scene').first(),layer=scene.locator('.character-motion');
 await expect.poll(()=>scene.locator('.character-laptop').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
 const b=await scene.boundingBox();await page.mouse.move(b.x+b.width*.85,b.y+b.height*.3);
 const tilt=()=>layer.evaluate(el=>{const m=new DOMMatrixReadOnly(getComputedStyle(el).transform);return Math.abs(m.m13)+Math.abs(m.m23);});
 await expect.poll(tilt).toBeGreaterThan(.01);await page.mouse.move(5,5);await expect.poll(tilt).toBeLessThan(.001);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();const r=await scene.boundingBox();await page.mouse.move(r.x+r.width*.85,r.y+r.height*.3);expect(await tilt()).toBe(0);
 expect(await layer.evaluate(el=>new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)).toBe(0);
});
test('page entrance and hero departure work without sample projects',async({page})=>{
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await expect.poll(()=>page.locator('.page-intro').evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(0);
 await expect.poll(()=>page.locator('.hero-copy > div').last().evaluate(el=>Number(getComputedStyle(el).opacity))).toBe(1);
 expect(await page.locator('.page-intro').evaluate(el=>getComputedStyle(el).pointerEvents)).toBe('none');
 await page.locator('#projects').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await expect.poll(()=>page.locator('.hero-shell .hero').evaluate(el=>Number(getComputedStyle(el).opacity))).toBeLessThan(.1);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await expect(page.locator('.page-intro')).toHaveCount(0);
 expect(await page.locator('.hero-shell .hero').evaluate(el=>getComputedStyle(el).transform)).toBe('none');
});
test('EN/VI switch translates content, preserves form input and persists on reload',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByLabel('Your name').fill('Demo Visitor');
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('lang','vi');
 await page.evaluate(()=>document.fonts.load('16px "JetBrains NF Mono"','Tiếng Việt'));
 expect(await page.locator('body').evaluate(el=>getComputedStyle(el).fontFamily)).toContain('JetBrains NF Mono');
 await expect(page.getByRole('button',{name:'Tiếng Việt',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByRole('heading',{level:1})).toContainText('Xin chào');
 await expect(page.getByLabel('Tên của bạn')).toHaveValue('Demo Visitor');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','vi');
 for(const width of [375,768,1024,1440]){await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:375,height:812});await page.getByRole('button',{name:'Mở menu'}).click();await expect(page.locator('#mobile-nav').getByRole('link',{name:'Dự án',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'English',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('lang','en');await expect(page.locator('#mobile-nav').getByRole('link',{name:'Projects',exact:true})).toBeVisible();
});
test('official portfolio has empty experience, no sample projects, a retained CV button and an email draft form',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await expect(page.locator('#experience .experience-list')).toBeEmpty();await expect(page.locator('#projects .empty-projects')).toHaveText('None');
 await expect(page.locator('.project,.project-index,.project-guide')).toHaveCount(0);
 await expect(page.getByText(/sample|demo|mẫu/i)).toHaveCount(0);
 const cv=page.getByRole('link',{name:'View CV',exact:true});await expect(cv).toHaveAttribute('href','/resume.pdf');await expect(cv).toHaveAttribute('target','_blank');await expect(cv).not.toHaveAttribute('download',/.*/);const pdf=await page.request.get('/resume.pdf');expect(pdf.ok()).toBe(true);expect(pdf.headers()['content-type']).toContain('application/pdf');expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
 await page.locator('header .header-inner > nav a[href="#experience"]').click();await expect(page).toHaveURL(/#experience$/);
 await page.getByLabel('Your name').fill('Visitor');await page.getByLabel('Email address').fill('visitor@example.com');await page.getByLabel('What’s on your mind?').fill('Cloud & infrastructure?');await page.getByRole('button',{name:'Open email draft',exact:true}).click();
 const draft=page.getByRole('link',{name:'Open email draft again',exact:true});const url=await draft.getAttribute('href');expect(url).toContain('mailto:vinhnp26@gmail.com?');const params=new URLSearchParams(url.split('?')[1]);expect(params.get('subject')).toBe('Portfolio enquiry — Visitor');expect(params.get('body')).toBe('Cloud & infrastructure?\n\nVisitor\nvisitor@example.com');await expect(page.getByRole('status')).toContainText('Send it from your email app.');
 await page.getByRole('button',{name:'Tiếng Việt',exact:true}).click();await expect(page.locator('#projects .empty-projects')).toHaveText('Chưa có dự án');
 await page.screenshot({path:'artifacts/official-desktop.png',fullPage:true});
 await page.setViewportSize({width:375,height:812});await page.getByRole('button',{name:'Mở menu'}).click();await expect(page.locator('#mobile-nav').getByRole('link',{name:'Kinh nghiệm',exact:true})).toBeVisible();await expect(page.locator('#mobile-nav').getByRole('link',{name:'Xem CV'})).toHaveAttribute('href','/resume.pdf');await expect(page.locator('#mobile-nav').getByRole('link',{name:'Xem CV'})).toHaveAttribute('target','_blank');expect(errors).toEqual([]);
});
test('mobile navigation, responsive width and reduced motion',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [375,768,1024]){await page.setViewportSize({width,height:900});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}
 await page.setViewportSize({width:375,height:812});await page.goto('/');await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('button',{name:'Close navigation'})).toHaveAttribute('aria-expanded','true');await page.locator('#mobile-nav').getByRole('link',{name:'Projects',exact:true}).click();await expect(page.locator('#mobile-nav')).toHaveCount(0);await expect(page).toHaveURL(/#projects$/);await page.goto('/');await page.screenshot({path:'artifacts/mobile.png',fullPage:true});
});
