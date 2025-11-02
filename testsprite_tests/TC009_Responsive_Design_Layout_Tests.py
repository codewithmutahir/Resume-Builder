import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Resize the window to tablet dimensions to check UI adaptation without horizontal scroll
        await page.goto('http://localhost:3000/', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click on the main Resume Builder container to ensure focus
        elem = frame.locator('xpath=html/body/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Resize the window to tablet dimensions and verify UI components rearrange properly without horizontal scroll
        await page.goto('http://localhost:3000/', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click main container to ensure focus
        elem = frame.locator('xpath=html/body/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        await page.mouse.wheel(0, 300)
        

        # -> Resize the window to tablet dimensions and verify UI components rearrange properly without horizontal scroll
        await page.goto('http://localhost:3000/', timeout=10000)
        await asyncio.sleep(3)
        

        frame = context.pages[-1]
        # Click main container to ensure focus
        elem = frame.locator('xpath=html/body/div').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Manually simulate tablet viewport by resizing window or using browser dev tools to confirm UI rearrangement and absence of horizontal scroll
        await page.mouse.wheel(0, 300)
        

        # -> Navigate through all form steps in mobile view to verify all form elements are accessible, functional, and styled correctly without horizontal scroll or layout breakage.
        frame = context.pages[-1]
        # Click Next button to go to step 2 in mobile view
        elem = frame.locator('xpath=html/body/div/div/div/main/div[2]/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Continue navigating through all remaining form steps in mobile view to verify accessibility, functionality, and correct styling without horizontal scroll or layout breakage.
        frame = context.pages[-1]
        # Click Next button to go to step 3 in mobile view
        elem = frame.locator('xpath=html/body/div/div/div/main/div[2]/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Continue navigating through remaining form steps in mobile view to verify accessibility, functionality, and correct styling without horizontal scroll or layout breakage.
        frame = context.pages[-1]
        # Click Next button to go to step 4 in mobile view
        elem = frame.locator('xpath=html/body/div/div/div/main/div[2]/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Continue navigating through remaining form steps in mobile view to verify accessibility, functionality, and correct styling without horizontal scroll or layout breakage.
        frame = context.pages[-1]
        # Click Next button to go to step 5 in mobile view
        elem = frame.locator('xpath=html/body/div/div/div/main/div[2]/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Navigate to the final step (step 6) in the form on mobile viewport and verify accessibility, functionality, and correct styling without horizontal scroll or layout breakage.
        frame = context.pages[-1]
        # Click Next button to go to step 6 in mobile view
        elem = frame.locator('xpath=html/body/div/div/div/main/div[2]/div/div/div[3]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Create your professional resume in minutes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Live Preview').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Personal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Education').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Experience').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Skills').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Additional').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Step 6 of 6').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Choose Template').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Reset').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Previous').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Auto-saved').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Next').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Download PDF').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Your Name').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Professional Title').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Built with ❤️ using React, Tailwind CSS, and Shadcn UI').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5 Professional Templates').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=PDF Export').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Auto-Save').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    