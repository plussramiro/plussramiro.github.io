---
layout: page
permalink: /repositories/
title: Repositories
description: Selected GitHub repositories and research code.
nav: true
nav_order: 4
---

{% if site.data.repositories.github_users %}
<p>
  GitHub profile:
  {% for user in site.data.repositories.github_users %}
    <a href="https://github.com/{{ user }}" target="_blank" rel="noopener noreferrer">{{ user }}</a>{% unless forloop.last %}, {% endunless %}
  {% endfor %}
</p>
{% endif %}

{% if site.data.repositories.github_repos %}
## Selected Repositories

<ul>
  {% for repo in site.data.repositories.github_repos %}
    <li>
      <a href="https://github.com/{{ repo }}" target="_blank" rel="noopener noreferrer">{{ repo }}</a>
    </li>
  {% endfor %}
 </ul>
{% endif %}
