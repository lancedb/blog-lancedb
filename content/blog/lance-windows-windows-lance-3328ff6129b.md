---
title: Lance, Windows. Windows, Lance
date: 2023-05-31
draft: false
featured: false
image: /assets/blog/1.png
description: Explore lance, windows. windows, lance with practical insights and expert guidance from the LanceDB team.
author: Chang She
---
It was Spring of 2012. After being an avid user for 2+ years, I finally decided to join Wes Mckinney and work on pandas full time. We worked out of an apartment in Brooklyn on pandas by day. By night Wes was working on the first edition of Python for Data Analysis while I was working on what probably was the very first python package for quantitative portfolio management.

👷 In the days before github actions, distributing your python package was a very manual affair. We had a Mac Mini that we used to build the mac wheel, and our own linux desktops to build the linux wheel. We had no windows machines and didn’t have the bandwidth to deal with yet another toolchain.

🚑 And that’s when Christoph came to the rescue. I knew him best by his academic url [https://www.lfd.uci.edu/~gohlke](https://www.lfd.uci.edu/~gohlke), where he build windows binaries for pandas, along with a lot of other packages in the scientific python stack that didn’t build windows wheels (or sometimes no wheels at all). Prior to each release we would send an email to Christoph and magically windows wheels would show up in a few days.

😢 I was saddened to come across this [old Reddit post](https://www.reddit.com/r/Python/comments/vcaibq/christoph_gohlkes_windows_wheels_site_is_shutting/) saying that Christoph’s lab has lost funding and the windows binaries would stop updating. I sincerely hope that work is able to continue elsewhere and he’s able to find funding elsewhere. Without his contributions to each and every package he maintained, the python data community would be largely devoid of windows users.

# Windows support is coming to Lance

Christoph and so many unsung heroes of the python OSS community have been keeping the whole scientific python stack standing all these years. It is with this feeling of immense gratitude that we’re announcing windows support in Lance starting v0.4.0.

## Installation and usage

Installing Lance on Windows is the same as other OS: `pip install pylance` . Windows wheels are only available starting v0.4.0.

Using Lance in python is also the same with `import lance` , `lance.dataset(uri)` , and `lance.write_data(data, uri)` .

## Non-user facing changes

Required changes for supporting windows came in two flavors:

1. Importing different libraries based on OS. This is no different than say using accelerate on MacOS vs openblas on Linux. Sometimes if MacOS and Linux behavior should be the same but different from windows, you can use `cfg(target_os = “unix”)` as the flag.
2. Where the rubber meets the operating system. This usually manifested as dealing with file paths, tilde’s, and backwards vs forward slashes. Fortunately Rust crates like `shellexpand` takes care most of this as well.

## Packaging and testing

Turns out most of the time and effort was spent in testing changes, setting up the right dev / test environments, and also including the required dll’s with the final python wheel.

The testing loop for github actions is slow so adding the required GHA for CI and CD are particularly frustrating. Manually installing protoc, configuring vcpkg, caching, etc etc etc. Each problem / task would take a long time.

## Limitations

In this first milestone for windows support, we don’t yet link to LAPACK, which means that the OPQ option for the vector index in Lance is disabled on Windows. We’ll be addressing this soon.

## Acknowledgements

Windows support would not be possible without the great work of Giancarlo Silvestrin, with additional contributions from Dennis Collinson.

# Feedback welcome

If you’re on windows and interested in working with data on python, you can try out lance with `pip install -U pylance` . We’d love to hear your feedback. For more details, please check us out [on github](http://github.com/eto-ai/lance) and don’t forget to give us a 🌟 if you like us!

Last but not least — Thank you Chistoph!
